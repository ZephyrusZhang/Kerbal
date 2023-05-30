import request from "./request";
import { responseToast } from "./toast";

export const sendOperation = (operation: 'start' | 'shutdown' | 'reboot' | 'reset', uuid: string) => {
  request.post(`/api/cluster/domain/${uuid}/${operation}`).then(response => {
    responseToast(response.data.status,
      `Domain ${operation} successfully`,
      `Fail to ${operation} domain. Reason: ${response.data.reason}`)
  })
}