export default async function saveTaskToServer(task) {
  await new Promise((res) => setTimeout(res, 2000));
  return task;
}