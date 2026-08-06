import { fetchApi } from './api'

export const getActivities = async () => {
  const data = await fetchApi('/activities')
  return data.activities || []
}
