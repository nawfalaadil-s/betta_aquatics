import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, UserPlus, Search, PauseCircle, PlayCircle, 
  Trash2, Edit3, KeyRound, Download, RefreshCw, 
  Shield, Check, Copy, AlertTriangle, X, Mail, Phone,
  Calendar, CheckCircle2, UserCheck, ShieldAlert,
  UserX, Filter
} from 'lucide-react';
import { mockDb, StoredUser } from '../../lib/mockDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserRole, UserStatus } from '../../lib/types';
import { ROLE_LABELS } from '../../lib/permissions';
import { 
  fetchSupabaseProfiles, 
  upsertSupabaseProfile, 
  setSupabaseProfileStatus, 
  deleteSupabaseProfile 
} from '../../lib/supabaseSync';
import { formatDate } from '../../lib/utils';

const ALL_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all store modules and configurations' },
  { value: 'product_manager', label: 'Product Manager', description: 'Manage inventory, live stock, pricing, and categories' },
  { value: 'order_manager', label: 'Order Manager', description: 'Process shipments, verify orders, and print invoices' },
  { value: 'payment_reviewer', label: 'Payment Reviewer', description: 'Review and verify manual UPI payments and UTRs' },
  { value: 'content_manager', label: 'Content Manager', description: 'Edit visual CMS pages, banners, and care guide blogs' },
  { value: 'customer', label: 'Customer', description: 'Standard buyer account for browsing and shopping' },
];

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<StoredUser[]>(() => mockDb.getUsers());
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Selected User for action
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'customer' as UserRole,
    password: '',
    status: 'active' as UserStatus,
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    role: 'customer' as UserRole,
    status: 'active' as UserStatus,
  });

  // Reset Password State
  const [customPassword, setCustomPassword] = useState('');
  const [generatedPasswordResult, setGeneratedPasswordResult] = useState<string | null>(null);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  // Form Submitting indicator
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load and sync users from Supabase and mockDb
  const refreshUsersList = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const supaProfiles = await fetchSupabaseProfiles();
      if (supaProfiles && supaProfiles.length > 0) {
        // Sync any Supabase profile into mockDb if missing or updated
        for (const p of supaProfiles) {
          const local = mockDb.getUserByEmail(p.email);
          if (!local) {
            mockDb.createUser({
              full_name: p.full_name,
              email: p.email,
              phone: p.phone,
              role: p.role,
              status: p.status || 'active',
            });
          } else {
            // Update status & role if mismatch
            if (local.status !== p.status || local.role !== p.role) {
              mockDb.updateUser(local.id, {
                status: p.status || 'active',
                role: p.role,
                full_name: p.full_name,
                phone: p.phone,
              });
            }
          }
        }
      }
      setUsers(mockDb.getUsers());
    } catch (err) {
      console.warn('Users refresh fallback:', err);
      setUsers(mockDb.getUsers());
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshUsersList(true);

    const handleUpdate = () => {
      setUsers(mockDb.getUsers());
    };

    window.addEventListener('ba_users_updated', handleUpdate);
    return () => {
      window.removeEventListener('ba_users_updated', handleUpdate);
    };
  }, [refreshUsersList]);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Search matching
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchName = u.full_name.toLowerCase().includes(query);
        const matchEmail = u.email.toLowerCase().includes(query);
        const matchPhone = u.phone?.toLowerCase().includes(query);
        const matchRole = u.role.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchPhone && !matchRole) {
          return false;
        }
      }

      // Role Filter
      if (roleFilter === 'admins' && u.role !== 'admin') return false;
      if (roleFilter === 'staff' && (u.role === 'customer' || u.role === 'admin')) return false;
      if (roleFilter === 'customers' && u.role !== 'customer') return false;
      if (roleFilter !== 'all' && roleFilter !== 'admins' && roleFilter !== 'staff' && roleFilter !== 'customers') {
        if (u.role !== roleFilter) return false;
      }

      // Status Filter
      if (statusFilter === 'active' && u.status !== 'active' && u.status) return false;
      if (statusFilter === 'paused' && u.status !== 'paused') return false;

      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin' && (u.status === 'active' || !u.status)).length;
    const staff = users.filter(u => u.role !== 'admin' && u.role !== 'customer').length;
    const customers = users.filter(u => u.role === 'customer' && (u.status === 'active' || !u.status)).length;
    const paused = users.filter(u => u.status === 'paused' || u.status === 'suspended').length;
    return { total, admins, staff, customers, paused };
  }, [users]);

  // Handle Account Pause / Resume toggle
  const handleToggleStatus = async (user: StoredUser) => {
    // Prevent self-pausing
    if (currentAdmin && (user.id === currentAdmin.id || user.email === currentAdmin.email)) {
      showToast('Security Action Denied: You cannot pause your own currently active administrator session.', 'error');
      return;
    }

    const newStatus: UserStatus = user.status === 'paused' ? 'active' : 'paused';

    // Last admin safeguard
    if (user.role === 'admin' && newStatus === 'paused') {
      const remainingAdmins = users.filter(u => u.role === 'admin' && (u.status === 'active' || !u.status) && u.id !== user.id);
      if (remainingAdmins.length === 0) {
        showToast('Action Denied: Cannot pause the only remaining active store administrator.', 'error');
        return;
      }
    }

    try {
      const res = mockDb.setUserStatus(user.id, newStatus, currentAdmin?.full_name || 'Admin');
      if (!res.success) {
        showToast(res.message, 'error');
        return;
      }

      await setSupabaseProfileStatus(user.id, newStatus);
      showToast(res.message, 'success');
      refreshUsersList(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to update account status.', 'error');
    }
  };

  // Open Create Account Modal
  const openCreateModal = () => {
    setCreateForm({
      full_name: '',
      email: '',
      phone: '',
      role: 'customer',
      password: '',
      status: 'active',
    });
    setIsCreateModalOpen(true);
  };

  // Submit Create Account
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.full_name.trim() || !createForm.email.trim()) {
      showToast('Please provide both full name and email address.', 'error');
      return;
    }

    if (createForm.password && createForm.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = mockDb.createUser({
        full_name: createForm.full_name,
        email: createForm.email,
        phone: createForm.phone || undefined,
        role: createForm.role,
        password: createForm.password || undefined,
        status: createForm.status,
      });

      await upsertSupabaseProfile({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      });

      showToast(`Account successfully created for ${newUser.full_name} (${newUser.email}).`, 'success');
      setIsCreateModalOpen(false);
      refreshUsersList(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to create user account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit User Modal
  const openEditModal = (user: StoredUser) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name,
      phone: user.phone || '',
      role: user.role,
      status: user.status || 'active',
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editForm.full_name.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }

    // Protection: Prevent demoting self from admin if current admin
    if (currentAdmin && (selectedUser.id === currentAdmin.id || selectedUser.email === currentAdmin.email)) {
      if (editForm.role !== 'admin') {
        showToast('Security Action Denied: You cannot revoke your own administrator role.', 'error');
        return;
      }
      if (editForm.status === 'paused') {
        showToast('Security Action Denied: You cannot pause your own session.', 'error');
        return;
      }
    }

    // Protection: Prevent demoting the last active admin
    if (selectedUser.role === 'admin' && editForm.role !== 'admin') {
      const otherAdmins = users.filter(u => u.role === 'admin' && (u.status === 'active' || !u.status) && u.id !== selectedUser.id);
      if (otherAdmins.length === 0) {
        showToast('Action Denied: Cannot change role of the last remaining store administrator.', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const updated = mockDb.updateUser(selectedUser.id, {
        full_name: editForm.full_name,
        phone: editForm.phone || undefined,
        role: editForm.role,
        status: editForm.status,
      });

      await upsertSupabaseProfile({
        id: updated.id,
        email: updated.email,
        full_name: updated.full_name,
        phone: updated.phone,
        role: updated.role,
        status: updated.status,
      });

      showToast(`Account updated for ${updated.full_name}.`, 'success');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      refreshUsersList(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to update user account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Reset Password Modal
  const openResetModal = (user: StoredUser) => {
    setSelectedUser(user);
    setCustomPassword('');
    setGeneratedPasswordResult(null);
    setHasCopiedPassword(false);
    setIsResetModalOpen(true);
  };

  // Submit Password Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (customPassword && customPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    const res = mockDb.resetUserPassword(selectedUser.id, customPassword || undefined);
    if (res.success) {
      setGeneratedPasswordResult(res.tempPassword || customPassword || 'Updated');
      showToast(res.message, 'success');
      refreshUsersList(true);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Copy password to clipboard
  const handleCopyPassword = () => {
    if (generatedPasswordResult) {
      navigator.clipboard.writeText(generatedPasswordResult);
      setHasCopiedPassword(true);
      showToast('Temporary password copied to clipboard!', 'info');
      setTimeout(() => setHasCopiedPassword(false), 3000);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (user: StoredUser) => {
    if (currentAdmin && (user.id === currentAdmin.id || user.email === currentAdmin.email)) {
      showToast('Security Action Denied: You cannot delete your own currently active administrator session.', 'error');
      return;
    }
    if (user.role === 'admin') {
      const remainingAdmins = users.filter(u => u.role === 'admin' && u.id !== user.id);
      if (remainingAdmins.length === 0) {
        showToast('Security Action Denied: Cannot delete the only remaining store administrator.', 'error');
        return;
      }
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Submit Delete Account
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = mockDb.deleteUser(selectedUser.id, currentAdmin?.id);
      if (!res.success) {
        showToast(res.message, 'error');
        return;
      }

      await deleteSupabaseProfile(selectedUser.id);
      showToast(res.message, 'success');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      refreshUsersList(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      showToast('No user records available to export.', 'info');
      return;
    }

    const headers = ['Account ID', 'Full Name', 'Email Address', 'Phone Number', 'Assigned Role', 'Account Status', 'Created At'];
    const rows = filteredUsers.map(u => [
      `"${u.id}"`,
      `"${u.full_name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      `"${u.role}"`,
      `"${u.status || 'active'}"`,
      `"${u.created_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `betta_aquatics_users_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredUsers.length} user records to CSV.`, 'success');
  };

  // Get Role badge visual
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800/80"><Shield className="w-3 h-3 text-red-400" /> Administrator</span>;
      case 'product_manager':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800/80">Product Manager</span>;
      case 'order_manager':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">Order Manager</span>;
      case 'payment_reviewer':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/80">Payment Reviewer</span>;
      case 'content_manager':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800/80">Content Manager</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">Customer</span>;
    }
  };

  // Get Status badge visual
  const getStatusBadge = (status?: UserStatus) => {
    if (status === 'paused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/80 shadow-sm">
          <PauseCircle className="w-3 h-3 text-amber-400" /> Paused
        </span>
      );
    }
    if (status === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-700/80 shadow-sm">
          <UserX className="w-3 h-3 text-red-400" /> Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-blue-500" /> User Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800 rounded-full">
              {users.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Create accounts, manage access roles, pause login privileges, and maintain administrative directory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refreshUsersList()}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm disabled:opacity-60"
            title="Refresh user directory from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Accounts</p>
            <p className="text-2xl font-black text-white mt-0.5">{metrics.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Administrators</p>
            <p className="text-2xl font-black text-red-400 mt-0.5">{metrics.admins}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Staff Members</p>
            <p className="text-2xl font-black text-purple-400 mt-0.5">{metrics.staff}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Customers</p>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{metrics.customers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Paused Accounts</p>
            <p className="text-2xl font-black text-amber-400 mt-0.5">{metrics.paused}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <PauseCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone number, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Quick Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-200 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Role:</span>
          {[
            { id: 'all', label: 'All Users' },
            { id: 'admins', label: 'Admins' },
            { id: 'staff', label: 'All Staff' },
            { id: 'customers', label: 'Customers' },
            { id: 'product_manager', label: 'Product Mgr' },
            { id: 'order_manager', label: 'Order Mgr' },
            { id: 'payment_reviewer', label: 'Payment Rev' },
            { id: 'content_manager', label: 'Content Mgr' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table (Desktop) & Cards (Mobile) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <UserX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No users match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, selecting "All Users" or clear active status filters.
            </p>
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {filteredUsers.map((u) => {
                    const isSelf = currentAdmin && (u.id === currentAdmin.id || u.email === currentAdmin.email);
                    const isPaused = u.status === 'paused';

                    return (
                      <tr 
                        key={u.id}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          isPaused ? 'bg-amber-950/10' : ''
                        }`}
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{u.full_name || 'Anonymous User'}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 text-xs text-slate-300">
                          {u.phone ? (
                            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
                              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              {u.phone}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">No phone added</span>
                          )}
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          {getRoleBadge(u.role)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(u.status)}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {u.created_at ? formatDate(u.created_at) : '—'}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Pause / Resume Button */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={Boolean(isSelf)}
                              className={`p-2 rounded-lg transition-colors border ${
                                isPaused
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                                  : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border-amber-800'
                              } disabled:opacity-40 disabled:pointer-events-none`}
                              title={
                                isSelf
                                  ? 'Cannot pause your own active session'
                                  : isPaused
                                  ? 'Activate user account'
                                  : 'Pause user account (blocks store login)'
                              }
                            >
                              {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                              title="Edit user details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Reset Password Button */}
                            <button
                              onClick={() => openResetModal(u)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                              title="Reset user password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => openDeleteModal(u)}
                              disabled={Boolean(isSelf)}
                              className="p-2 bg-red-950/50 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
                              title={isSelf ? 'Cannot delete your own active session' : 'Permanently delete account'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden divide-y divide-slate-800">
              {filteredUsers.map((u) => {
                const isSelf = currentAdmin && (u.id === currentAdmin.id || u.email === currentAdmin.email);
                const isPaused = u.status === 'paused';

                return (
                  <div 
                    key={u.id}
                    className={`p-4 space-y-3 ${isPaused ? 'bg-amber-950/15' : ''}`}
                  >
                    {/* Header: Name, Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{u.full_name || 'Anonymous User'}</h4>
                            {isSelf && (
                              <span className="px-1.5 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(u.status)}</div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Role</span>
                        <div className="mt-0.5">{getRoleBadge(u.role)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone</span>
                        <span className="text-slate-300 font-mono mt-0.5 block">
                          {u.phone || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons Bar */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={Boolean(isSelf)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                          isPaused
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        } disabled:opacity-40`}
                      >
                        {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Activate' : 'Pause'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(u)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => openResetModal(u)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                        title="Reset password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>

                      <button
                        onClick={() => openDeleteModal(u)}
                        disabled={Boolean(isSelf)}
                        className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl disabled:opacity-40"
                        title="Delete account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New User Account</h3>
                  <p className="text-xs text-slate-400">Add an administrator, staff member, or customer</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="user@bettaaquatics.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                  >
                    <option value="active">Active (Can log in)</option>
                    <option value="paused">Paused (Login blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Initial Password <span className="text-slate-500 font-normal lowercase">(Optional, defaults to Betta@123)</span>
                </label>
                <input
                  type="text"
                  placeholder="Min 6 characters"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono outline-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit User Profile</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused (Access Disabled)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsResetModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {generatedPasswordResult ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Password Reset Successfully</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Share this temporary password with {selectedUser.full_name}:
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 font-mono text-sm text-emerald-400 font-bold">
                    <span>{generatedPasswordResult}</span>
                    <button
                      onClick={handleCopyPassword}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 text-xs font-sans transition-colors"
                    >
                      {hasCopiedPassword ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{hasCopiedPassword ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsResetModalOpen(false);
                      setSelectedUser(null);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Set a new password for <strong className="text-white">{selectedUser.full_name}</strong>. If left blank, a random secure password will be generated automatically.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      New Password (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave empty to auto-generate"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 font-mono outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetModalOpen(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-red-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete User Account</h3>
                  <p className="text-xs text-red-300">Permanent and non-reversible action</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete account{' '}
                <strong className="text-white">{selectedUser.full_name}</strong> (
                <span className="font-mono text-xs text-slate-400">{selectedUser.email}</span>)?
              </p>

              <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-xs text-red-300 space-y-1">
                <p className="font-bold">⚠️ Warning:</p>
                <p>This will permanently purge this user's profile and revoke all portal login permissions immediately.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting Account...' : 'Permanently Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
