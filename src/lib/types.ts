export type UserRole = "ADMINISTRATOR" | "HR_MANAGER" | "DEPARTMENT_HEAD" | "EMPLOYEE";
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "LEAVE"
  | "HOLIDAY"
  | "HALF_DAY"
  | "WEEKEND";
export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "MATERNITY"
  | "PATERNITY"
  | "BEREAVEMENT"
  | "STUDY"
  | "UNPAID"
  | "OTHER";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
  errors?: unknown;
  pagination?: Pagination;
  stats?: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  headEmployeeId: string | null;
  employeeCount?: number;
}

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  workingHours: number | null;
}

export interface Employee {
  id: string;
  employeeId: string;
  userId: string | null;
  user: { firstName: string; lastName: string; email: string; isActive?: boolean } | null;
  departmentId: string | null;
  department: Department | null;
  position: string | null;
  employmentType: string | null;
  shiftId: string | null;
  shift: Shift | null;
  status: EmployeeStatus;
  phone: string | null;
  photoUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  dateEmployed: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: {
    user: { firstName: string; lastName: string; email: string } | null;
    department?: Department | null;
  };
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  totalHours: number | null;
  overtimeHours: number | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
}

export interface AttendanceStats {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  holiday: number;
  halfDay: number;
  totalHours: number;
  overtimeHours: number;
  attendanceRate: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee?: {
    user: { firstName: string; lastName: string; email: string } | null;
    department?: Department | null;
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface LeaveBalanceStats {
  balance: {
    annual: number;
    sick: number;
    maternity: number;
    paternity: number;
    bereavement: number;
    study: number;
    unpaid: number;
    other: number;
  };
  totalUsed: number;
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface Backup {
  id: string;
  name: string;
  fileSize: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  restoredAt: string | null;
}
