export type DomainStatus = 'running' | 'terminating' | 'terminated' | 'booting'

export interface GpuProps {
  bus?: string,
  domain_uuid?: string,
  free?: boolean,
  function?: string,
  gpu_id?: string,
  name?: string,
  node_id?: string,
  online?: boolean,
  slot?: string,
  vram_size?: number
}

export interface DomainProps {
  domain_id?: number,
  domain_uuid?: string,
  port?: number,
  running_disk_id?: string,
  spec?: {
    cpu_count: number,
    gpus: Array<GpuProps>,
    ram_size: number
  },
  status: DomainStatus,
  password: string
}