export const gigStatusEnum = {
  OPEN: "open",
  ASSIGNED: "assigned",
};

// AvailableUserRoles holds: ["admin", "project_admin", "member"]
export const GigStatusEnum = Object.values(gigStatusEnum);

export const bidStatusEnum = {
  HIRED: "hired",
  PENDING: "pending",
  REJECTED: "rejected",
};

// AvailableTaskStatuses holds: ["todo", "in_progress", "done"]
export const BidStatusEnum = Object.values(bidStatusEnum);
