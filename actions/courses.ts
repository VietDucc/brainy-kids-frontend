export const getCourses = async () => {
  const response = await fetch(`${process.env.BASE_URL_API}/courses`);
  const data = await response.json();
  return data;
};
