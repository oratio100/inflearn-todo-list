export default function formatDate(dateString: string) {
  const date = new Date(dateString);
  const time = date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  const [timeValue, period] = time.split(" "); // "4:58:32 AM" -> ["4:58:32", "AM"]

  return `${date.getFullYear() % 100}. ${
    date.getMonth() + 1
  }. ${date.getDate()} ${period} ${timeValue}`;
}
