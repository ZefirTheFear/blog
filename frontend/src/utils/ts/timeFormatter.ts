export default (time: Date) => {
  const seconds = Math.round((new Date().getTime() - new Date(time).getTime()) / 1000);
  if (seconds <= 60) {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (seconds > 60 && seconds <= 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (seconds > 3600 && seconds <= 86400) {
    const hours = Math.round(seconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.round(seconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};
