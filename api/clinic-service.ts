import { sendRequest } from "@/api/api";
import type {
  Appointment,
  AppointmentDetail,
  AuthResponse,
  BookAppointmentPayload,
  ClinicInfo,
  CreateUserPayload,
  DoctorQueueItem,
  LoginCredentials,
  Prescription,
  PrescriptionPayload,
  QueueEntry,
  QueueTransitionStatus,
  Report,
  ReportPayload,
  UserSummary,
} from "@/lib/types";

const routes = {
  login: "/auth/login",
  clinicInfo: "/admin/clinic",
  users: "/admin/users",
  appointments: "/appointments",
  prescriptions: "/prescriptions",
  reports: "/reports",
  queue: "/queue",
  doctorQueue: "/doctor/queue",
};

export async function getClinicSummary(token: string) {
  return sendRequest<ClinicInfo>(routes.clinicInfo, {}, token);
}

export async function authenticateUser(credentials: LoginCredentials) {
  return sendRequest<AuthResponse>(routes.login, {
    method: "POST",
    body: credentials,
  });
}

export async function listClinicUsers(token: string) {
  return sendRequest<UserSummary[]>(routes.users, {}, token);
}

export async function addClinicUser(token: string, payload: CreateUserPayload) {
  return sendRequest<UserSummary>(routes.users, {
    method: "POST",
    body: payload,
  }, token);
}

export async function scheduleAppointment(token: string, payload: BookAppointmentPayload) {
  return sendRequest<Appointment>(routes.appointments, {
    method: "POST",
    body: payload,
  }, token);
}

export async function getMyAppointments(token: string) {
  return sendRequest<Appointment[]>(`${routes.appointments}/my`, {}, token);
}

export async function getAppointmentDetails(token: string, appointmentId: number) {
  return sendRequest<AppointmentDetail>(`${routes.appointments}/${appointmentId}`, {}, token);
}

export async function getMyPrescriptions(token: string) {
  return sendRequest<Prescription[]>(`${routes.prescriptions}/my`, {}, token);
}

export async function getMyReports(token: string) {
  return sendRequest<Report[]>(`${routes.reports}/my`, {}, token);
}

export async function getQueueForDate(token: string, date: string) {
  return sendRequest<QueueEntry[]>(
    `${routes.queue}?date=${encodeURIComponent(date)}`,
    {},
    token,
  );
}

export async function changeQueueStatus(
  token: string,
  queueId: number,
  status: QueueTransitionStatus,
) {
  return sendRequest<QueueEntry>(`${routes.queue}/${queueId}`, {
    method: "PATCH",
    body: { status },
  }, token);
}

export async function getDoctorQueue(token: string) {
  return sendRequest<DoctorQueueItem[]>(routes.doctorQueue, {}, token);
}

export async function addPrescription(
  token: string,
  appointmentId: number,
  payload: PrescriptionPayload,
) {
  return sendRequest<Prescription>(`${routes.prescriptions}/${appointmentId}`, {
    method: "POST",
    body: payload,
  }, token);
}

export async function addReport(
  token: string,
  appointmentId: number,
  payload: ReportPayload,
) {
  return sendRequest<Report>(`${routes.reports}/${appointmentId}`, {
    method: "POST",
    body: payload,
  }, token);
}
