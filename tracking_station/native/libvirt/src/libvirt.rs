use virt::{connect::Connect, domain::Domain, error::Error};


pub fn get_node_info(url: &str) -> Result<u32, Error> {
    let conn = Connect::open(url)?;
    let node_info = conn.get_node_info()?;

    Ok(node_info.cpus)
}

pub fn create_vm_from_xml(url: &str, xml: &str) -> Result<u32, Error> {
    let conn = Connect::open(url)?;

    let domain = Domain::create_xml(&conn, xml, 0)?;

    if let Some(domain_id) = domain.get_id() {
        return Ok(domain_id);
    }
    else {
        domain.destroy()?;
    }

    Ok(0)
}