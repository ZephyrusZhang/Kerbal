use rustler::NifStruct;
use virt::{connect::Connect, domain::Domain, error::Error};

#[derive(NifStruct)]
#[module = "TrackingStation.Scheduler.ResourceSpec"]
pub struct ResourceSpec {
    cpu_count: u32,
    ram_size: u64,
    gpu_count: u32,
    gpu_list: Vec<String>,
}

pub fn get_resources(url: &str) -> Result<ResourceSpec, Error> {
    let conn = Connect::open(url)?;
    let node_info = conn.get_node_info()?;

    Ok(ResourceSpec {
        cpu_count: node_info.cpus,
        ram_size: node_info.memory,
        gpu_count: 0,
        gpu_list: Vec::new(),
    })
}

pub fn create_vm_from_xml(url: &str, xml: &str) -> Result<u32, Error> {
    let conn = Connect::open(url)?;

    let domain = Domain::create_xml(&conn, xml, 0)?;

    if let Some(domain_id) = domain.get_id() {
        return Ok(domain_id);
    } else {
        domain.destroy()?;
    }

    Ok(0)
}
