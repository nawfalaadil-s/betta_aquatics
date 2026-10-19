import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, UserPlus, Search, PauseCircle, PlayCircle, 
  Trash2, Edit3, KeyRound, Download, RefreshCw, 
  Shield, Check, Copy, AlertTriangle, X, Mail, Phone,
  CheckCircle2, UserCheck, ShieldAlert,
  UserX, Filter, ChevronRight, Lock
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
  { value: 'admin', label: 'Store Administrator', description: 'Full executive access to products, orders, CMS, settings, and user management' },
  { value: 'product_manager', label: 'Product & Inventory Manager', description: 'Manage live fish specimens, inventory stock counts, pricing, and photo gallery' },
  { value: 'order_manager', label: 'Order & Logistics Manager', description: 'Process shipments, assign courier tracking numbers, and print consignments' },
  { value: 'payment_reviewer', label: 'Payment Reviewer', description: 'Inspect UPI references, check bank credit, and verify manual transactions' },
  { value: 'content_manager', label: 'Content & CMS Specialist', description: 'Design visual store pages, marketing banners, and write fish care guides' },
  { value: 'customer', label: 'Verified Customer', description: 'Standard buyer account for browsing, cart orders, and consignment tracking' },
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
    role: 'admin' as UserRole,
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
              id: p.id,
              full_name: p.full_name,
              email: p.email,
              phone: p.phone,
              role: p.role,
              status: p.status || 'active',
            });
          } else {
            // Update status & role if mismatch
            if (local.status !== p.status || local.role !== p.role || local.full_name !== p.full_name) {
              mockDb.updateUser(local.id, {
                status: p.status || 'active',
                role: p.role,
                full_name: p.full_name,
                phone: p.phone || local.phone,
              });
            }
          }
        }
      }
      setUsers(mockDb.getUsers());
    } catch (err) {
      console.warn('Users refresh fallback note:', err);
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
    if (currentAdmin && (user.id === currentAdmin.id || user.email.toLowerCase() === currentAdmin.email.toLowerCase())) {
      showToast('Action Denied: You cannot pause your own currently active administrator session.', 'error');
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

      // Immediately update local UI state
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      await setSupabaseProfileStatus(user.id, newStatus, user.email);
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
      role: 'admin',
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
      const cleanEmail = createForm.email.trim().toLowerCase();
      const pwd = createForm.password.trim() || 'betta aquatics';

      const newUser = mockDb.createUser({
        full_name: createForm.full_name,
        email: cleanEmail,
        phone: createForm.phone || undefined,
        role: createForm.role,
        password: pwd,
        status: createForm.status,
      });

      // Sync to Supabase PostgreSQL database
      const syncedProfile = await upsertSupabaseProfile({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      });

      if (syncedProfile && syncedProfile.id && syncedProfile.id !== newUser.id) {
        mockDb.updateUser(newUser.id, { id: syncedProfile.id });
      }

      showToast(`Account successfully configured for ${newUser.full_name} (${newUser.email}).`, 'success');
      setIsCreateModalOpen(false);
      setUsers(mockDb.getUsers());
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
    if (currentAdmin && (selectedUser.id === currentAdmin.id || selectedUser.email.toLowerCase() === currentAdmin.email.toLowerCase())) {
      if (editForm.role !== 'admin') {
        showToast('Action Denied: You cannot revoke your own administrator role.', 'error');
        return;
      }
      if (editForm.status === 'paused') {
        showToast('Action Denied: You cannot pause your own session.', 'error');
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

      // Immediately update local UI state
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? updated : u));

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
      setGeneratedPasswordResult(res.tempPassword || customPassword || 'betta aquatics');
      showToast(res.message, 'success');
      setUsers(mockDb.getUsers());
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
      showToast('Password copied to clipboard!', 'info');
      setTimeout(() => setHasCopiedPassword(false), 3000);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (user: StoredUser) => {
    if (currentAdmin && (user.id === currentAdmin.id || user.email.toLowerCase() === currentAdmin.email.toLowerCase())) {
      showToast('Action Denied: You cannot delete your own currently active administrator session.', 'error');
      return;
    }
    if (user.role === 'admin') {
      const remainingAdmins = users.filter(u => u.role === 'admin' && u.id !== user.id);
      if (remainingAdmins.length === 0) {
        showToast('Action Denied: Cannot delete the only remaining store administrator.', 'error');
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

      // Immediately remove from local UI
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));

      await deleteSupabaseProfile(selectedUser.id, selectedUser.email);
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
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <Shield className="w-3 h-3 text-red-600" /> Administrator
          </span>
        );
      case 'product_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Product Manager
          </span>
        );
      case 'order_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Order Manager
          </span>
        );
      case 'payment_reviewer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Payment Reviewer
          </span>
        );
      case 'content_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Content Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Customer
          </span>
        );
    }
  };

  // Get Status badge visual
  const getStatusBadge = (status?: UserStatus) => {
    if (status === 'paused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
          <PauseCircle className="w-3 h-3 text-amber-600" /> Paused
        </span>
      );
    }
    if (status === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
          <UserX className="w-3 h-3 text-red-600" /> Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono">
            Administration & Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-900" />
            <span>User Accounts & Access Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
            <span>Manage store administrators, staff permissions, customer directories, and account status.</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">Total Accounts: <strong>{users.length}</strong></span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refreshUsersList()}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-60"
            title="Refresh user directory from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-900 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Accounts</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{metrics.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Administrators</p>
            <p className="text-2xl font-black text-red-600 mt-0.5">{metrics.admins}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Operational Staff</p>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{metrics.staff}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Registered Customers</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{metrics.customers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Paused / Inactive</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{metrics.paused}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <PauseCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone number, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
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
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all border ${
                roleFilter === tab.id
                  ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <UserX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No users match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, selecting "All Users" or clearing active status filters.
            </p>
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs"
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
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">User Identity</th>
                    <th className="py-3.5 px-4">Contact Phone</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredUsers.map((u) => {
                    const isSelf = currentAdmin && (u.id === currentAdmin.id || u.email.toLowerCase() === currentAdmin.email.toLowerCase());
                    const isPaused = u.status === 'paused';

                    return (
                      <tr 
                        key={u.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isPaused ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                              {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs block">{u.full_name || 'Anonymous User'}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[10px] font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          {u.phone ? (
                            <span className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {u.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No phone added</span>
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
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
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
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 border-slate-200 hover:border-amber-200'
                              } disabled:opacity-30 disabled:pointer-events-none`}
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
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-900 border border-slate-200 rounded-lg transition-colors"
                              title="Edit user details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Reset Password Button */}
                            <button
                              onClick={() => openResetModal(u)}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-purple-700 border border-slate-200 rounded-lg transition-colors"
                              title="Reset user password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => openDeleteModal(u)}
                              disabled={Boolean(isSelf)}
                              className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
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
            <div className="block lg:hidden divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSelf = currentAdmin && (u.id === currentAdmin.id || u.email.toLowerCase() === currentAdmin.email.toLowerCase());
                const isPaused = u.status === 'paused';

                return (
                  <div 
                    key={u.id}
                    className={`p-4 space-y-3 ${isPaused ? 'bg-amber-50/20' : ''}`}
                  >
                    {/* Header: Name, Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{u.full_name || 'Anonymous User'}</h4>
                            {isSelf && (
                              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[10px] font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(u.status)}</div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Role</span>
                        <div className="mt-0.5">{getRoleBadge(u.role)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                        <span className="text-slate-700 font-mono mt-0.5 block">
                          {u.phone || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons Bar */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={Boolean(isSelf)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                          isPaused
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        } disabled:opacity-40`}
                      >
                        {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Activate' : 'Pause'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(u)}
                        className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => openResetModal(u)}
                        className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                        title="Reset password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>

                      <button
                        onClick={() => openDeleteModal(u)}
                        disabled={Boolean(isSelf)}
                        className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl disabled:opacity-40 shadow-2xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create New User Account</h3>
                  <p className="text-xs text-slate-500">Add an administrator, staff member, or customer</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Betta Aquatics"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="bettaaquticsno1@gmail.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 95975 17238"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                  >
                    <option value="active">Active (Can log in)</option>
                    <option value="paused">Paused (Login blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Password <span className="text-slate-400 font-normal lowercase">(Optional, defaults to betta aquatics)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="betta aquatics"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm text-slate-900 placeholder-slate-400 font-mono outline-none transition-all"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit User Profile</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused (Access Disabled)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Account Password</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsResetModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {generatedPasswordResult ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Password Reset Successfully</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Share this password with {selectedUser.full_name}:
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 font-mono text-sm text-slate-900 font-bold">
                    <span>{generatedPasswordResult}</span>
                    <button
                      onClick={handleCopyPassword}
                      className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1 text-xs font-sans transition-colors shadow-2xs"
                    >
                      {hasCopiedPassword ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{hasCopiedPassword ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsResetModalOpen(false);
                      setSelectedUser(null);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set a new password for <strong className="text-slate-900">{selectedUser.full_name}</strong>. If left blank, a random secure password will be generated automatically.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave empty to auto-generate"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl text-sm text-slate-900 placeholder-slate-400 font-mono outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetModalOpen(false);
                        setSelectedUser(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-red-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
                  <p className="text-xs text-red-600">Permanent and non-reversible action</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                Are you sure you want to permanently delete account{' '}
                <strong className="text-slate-900">{selectedUser.full_name}</strong> (
                <span className="font-mono text-xs text-slate-500">{selectedUser.email}</span>)?
              </p>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                <p className="font-bold">⚠️ Security Notice:</p>
                <p>This will permanently purge this user's profile and revoke all portal login permissions immediately.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
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
