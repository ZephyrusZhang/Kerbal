export type DomainStatus = 'running' | 'terminating' | 'terminated' | 'booting'
export type ImageDataset = 'base' | 'overlay'

export interface GpuProps {
  bus: string,
  domain_uuid: string,
  free: boolean,
  function: string,
  gpu_id: string,
  name: string,
  node_id: string,
  online: boolean,
  slot: string,
  vram_size: number
}

export interface DomainProps {
  cpu_stat: number,
  domain_id?: number,
  domain_uuid?: string,
  host_ipv4_addr?: string,
  image_dataset?: ImageDataset,
  image_name?: string,
  password?: string,
  port?: number,
  ram_stat: RamStatProp,
  running_disk_id?: string,
  spec?: DomainSpec,
  status: DomainStatus
}

export interface DomainSpec {
  cpu_count?: number,
  gpus?: Array<GpuProps>,
  image_id?: string,
  ram_size?: number
}

export interface RamStatProp {
  available: number,
  buffers?: number,
  cache?: number,
  free?: number,
  shared?: number,
  total: number,
  used: number
}

export interface ImageProps {
  available_nodes?: Array<string>,
  dataset?: ImageDataset,
  id?: string,
  name?: string
}

export interface NodeProps {
  cpu_count: number,
  free_cpu_count?: number,
  ram_size: number,
  free_ram_size?: number,
  gpus: Array<GpuProps>
  node_id: string,
  storage_role?: string
}