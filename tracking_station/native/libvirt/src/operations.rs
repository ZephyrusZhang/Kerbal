use rustler::NifStruct;
use std::str;
use std::thread;
use std::time::{Duration, Instant, SystemTime};
use virt::{connect::Connect, domain::Domain, error::Error};

#[derive(NifStruct)]
#[module = "TrackingStation.Scheduler.ResourceSpec"]
pub struct ResourceSpec {
    cpu_count: u32,
    ram_size: u64,
    gpu_count: u32,
    gpu_list: Vec<String>,
}

#[derive(NifStruct)]
#[module = "TrackingStation.Libvirt.DomainStats"]
pub struct DomainStats {
    unix_timestamp: u64,
    cpu_percent: f64,
    cpu_count: u32,
    max_mem: u64,
    mem_usage: u64,
}

// There is an problem in Domain::open_channel, don't use this function until it's fixed
// pub fn qemu_guest_agent(conn: &Connect, domain_id: u32, stream: &Stream, data: &[u8]) -> Result<Vec<u8>, Error> {
//     let domain = Domain::lookup_by_id(&conn, domain_id)?;
//     let _channel = domain.open_channel("org.qemu.guest_agent.0", stream, 0)?;

//     let mut offset = 0;
//     while offset < data.len() {
//         let bytes_sent = stream.send(&data[offset..])?;
//         offset += bytes_sent;
//         // bytes_sent can be 0
//         // https://libvirt.org/html/libvirt-libvirt-stream.html#virStreamSend
//     }

//     let mut reponse: Vec<u8> = Vec::with_capacity(1024);
//     let mut recv_buf: [u8; 1024] = [0; 1024];

//     while let Ok(bytes_recv) = stream.recv(&mut recv_buf) {
//         // bytes_recv == 0 is EOF
//         if bytes_recv == 0 {
//             stream.finish();
//             break;
//         }
//         reponse.extend_from_slice(&recv_buf[..bytes_recv]);
//     }

//     Ok(reponse)
// }

pub fn get_resources(conn: &Connect) -> Result<ResourceSpec, Error> {
    let node_info = conn.get_node_info()?;

    Ok(ResourceSpec {
        cpu_count: node_info.cpus,
        ram_size: node_info.memory,
        gpu_count: 0,
        gpu_list: Vec::new(),
    })
}

pub fn create_vm_from_xml(conn: &Connect, xml: &str) -> Result<u32, Error> {
    let domain = Domain::create_xml(&conn, xml, 0)?;

    if let Some(domain_id) = domain.get_id() {
        return Ok(domain_id);
    } else {
        domain.destroy()?;
    }

    Ok(0)
}

#[allow(dead_code)]
pub fn force_destroy_domain_by_id(_conn: &Connect, _domain_id: u32) -> Result<(), Error> {
    Ok(())
}

#[allow(dead_code)]
pub fn safe_destroy_domain_by_id(_conn: &Connect, _domain_id: u32) -> Result<(), Error> {
    Ok(())
}

pub fn poll_domain_stats(conn: &Connect, domain_id: u32) -> Result<DomainStats, Error> {
    let domain = Domain::lookup_by_id(&conn, domain_id)?;

    let begin = Instant::now();
    let first_measure = domain.get_info()?;
    let unix_timestamp = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    thread::sleep(Duration::from_micros(1));
    let second_measure = domain.get_info()?;
    let actual_duration = Instant::now().duration_since(begin);

    Ok(DomainStats {
        unix_timestamp,
        cpu_percent: (second_measure.cpu_time - first_measure.cpu_time) as f64
            / actual_duration.as_nanos() as f64,
        cpu_count: second_measure.nr_virt_cpu,
        max_mem: second_measure.max_mem,
        mem_usage: (first_measure.memory + second_measure.memory) / 2,
    })
}

pub fn destroy_domain(conn: &Connect, domain_id: u32) -> Result<(), Error> {
    let domain = Domain::lookup_by_id(&conn, domain_id)?;
    domain.destroy()?;
    Ok(())
}
