const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
const snapshotNameRegex = /^[0-9a-z_\-]+$/
const cpuOptions = [
  {value: 0, text: 'Any'},
  {value: 1, text: '1 vCPU'},
  {value: 2, text: '2 vCPU'},
  {value: 4, text: '4 vCPU'},
  {value: 8, text: '8 vCPU'},
  {value: 16, text: '16 vCPU'}
]

const memoryOptions = [
  {value: 0, text: 'Any'},
  {value: 1024 * 1024, text: '1 GB'},
  {value: 2 * 1024 * 1024, text: '2 GB'},
  {value: 4 * 1024 * 1024, text: '4 GB'},
  {value: 8 * 1024 * 1024, text: '8 GB'},
]

export { emailRegex, passwordRegex, snapshotNameRegex, cpuOptions, memoryOptions }
