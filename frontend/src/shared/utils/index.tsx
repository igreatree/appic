export const getElapsedTime = (date: Date) => {
    const fromDate = new Date(date);
    const toDate = new Date();
    const months = Math.floor(toDate.getMonth() - fromDate.getMonth());
    const elapsedTime = (toDate.getTime() - fromDate.getTime()) / 1000;
    if (elapsedTime < 60) {
        return "now"; //`${Math.floor(elapsedTime)}s`
    } else if (elapsedTime < 3600) {
        return `${Math.floor(elapsedTime / 60)}m`;
    } else if (elapsedTime < 86400) {
        return `${Math.floor(elapsedTime / 60 / 60)}h`;
    } else if (elapsedTime < 604800) {
        const days = Math.floor(elapsedTime / 60 / 60 / 24);
        return `${days}${days > 1 ? "days" : "day"}`;
    } else if (months < 1) {
        const weeks = Math.floor(elapsedTime / 60 / 60 / 24 / 7);
        return `${weeks}${weeks > 1 ? "weeks" : "week"}`;
    } else if (months > 0 && months < 12) {
        return `${months}${months > 1 ? "months" : "month"}`;
    } else {
        const years = Math.floor(months / 12);
        return `${years}${years > 1 ? "years" : "year"}`;
    }
};