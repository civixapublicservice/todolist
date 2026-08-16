import { fetchApi } from './api'

export const getActivities = async () => {
  const data = await fetchApi('/api/activities')
  return data.activities || []
}
