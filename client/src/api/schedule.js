import apiClient from '../utils/client';

export const getSchedule = (
  page = 1,
  { limit = 10, search = "", type = "", hour = "", minute = "" } = {},
) => {
  let link = `/route-points?page=${page}&limit=${limit}`;

  if (search) {
    link += `&search=${search}`;
  }

  if (type) {
    link += `&type=${type}`;
  }

  if (hour) {
    link += `&hour=${hour}`;
  }

  if (minute) {
    link += `&minute=${minute}`;
  }

  return apiClient(link);
};
