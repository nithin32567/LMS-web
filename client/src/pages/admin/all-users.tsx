import { useUsers } from '@/contexts/usercontext';

const AllUsers = () => {
  const { users, pagination, loading, error, fetchUsers } = useUsers();

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, pagination.limit);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => user.role?.toLowerCase() !== 'admin');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Users</h1>

      <div className="bg-[#1d1d1d] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2d2d2d]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3d3d] ">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-[#131313]' : 'bg-[#2d2d2d]'  
                      } hover:bg-accent/50`}
                  >
                    <td className="px-6 py-5">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg ring-2 ring-muted">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-foreground">{user.name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-foreground/70">{user.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${user.status === 'active'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-foreground/60">{formatDate(user.details.createdAt)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-foreground/60">{formatDate(user.details.lastLogin)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground/60">
            Showing <span className="font-medium text-foreground">{filteredUsers.length > 0 ? 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">{filteredUsers.length}</span> of{' '}
            <span className="font-medium text-foreground">{filteredUsers.length}</span> users
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-5 py-2 rounded-md bg-muted text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-foreground/70">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-5 py-2 rounded-md bg-muted text-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;