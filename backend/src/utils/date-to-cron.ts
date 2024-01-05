export function dateToCron(date: Date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const dayOfWeek = date.getDay(); // 0-6, Sunday-Saturday

    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}
