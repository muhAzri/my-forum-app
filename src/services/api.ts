import { ServiceContainer } from './ServiceContainer'

const serviceContainer = ServiceContainer.getInstance()
const httpClientService = serviceContainer.getHttpClientService()

export const api = httpClientService.axiosInstance
export default api