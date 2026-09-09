import { format, formatDistanceToNow, type DateArg } from "date-fns";
import { z } from "zod";

export default function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} is required` })
    .min(1, { message: `${fieldName} is required` })

export const timeAgo = (date: Date) => {
    return formatDistanceToNow(date) + ' ago';
}