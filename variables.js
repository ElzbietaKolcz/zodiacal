import { getISOWeek } from "date-fns";
import { auth } from "./firebase";

export const currentYear = new Date().getFullYear();
export const currentMonth = new Date().getMonth() + 1;
export const currentWeek = getISOWeek(new Date());
export const currentDay = new Date().getDate();
export const user = auth.currentUser;
