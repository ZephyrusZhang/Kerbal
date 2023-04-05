use virt;
use rustler::{Atom, Error};

mod atoms {
    rustler::atoms! {
        ok,
    }
}

mod libvirt;

fn libvirt_error_to_nif_error(libvirt_error: virt::error::Error) -> rustler::Error {
    return rustler::Error::Term(
        Box::new(libvirt_error.to_string())
    )
}

#[rustler::nif(schedule = "DirtyIo")]
fn get_node_info(url: &str) -> Result<(Atom, u32), Error> {
    libvirt::get_node_info(url)
        .map(|value| (atoms::ok(), value))
        .map_err(libvirt_error_to_nif_error)
}

#[rustler::nif(schedule = "DirtyIo")]
fn create_vm_from_xml(url: &str, xml: &str) -> Result<(Atom, u32), Error> {
    libvirt::create_vm_from_xml(url, xml)
        .map(|value| (atoms::ok(), value))
        .map_err(libvirt_error_to_nif_error)
}


rustler::init!("Elixir.TrackingStation.Libvirt", [get_node_info, create_vm_from_xml]);
