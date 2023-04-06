use rustler::{Atom, Error};
use virt;

mod atoms {
    rustler::atoms! {
        ok,
    }
}

mod libvirt;

fn libvirt_error_to_nif_error(libvirt_error: virt::error::Error) -> rustler::Error {
    return rustler::Error::Term(Box::new(libvirt_error.to_string()));
}

#[rustler::nif(schedule = "DirtyIo")]
fn get_resources(url: &str) -> Result<(Atom, libvirt::ResourceSpec), Error> {
    libvirt::get_resources(url)
        .map(|resource_spec| (atoms::ok(), resource_spec))
        .map_err(libvirt_error_to_nif_error)
}

#[rustler::nif(schedule = "DirtyIo")]
fn create_vm_from_xml(url: &str, xml: &str) -> Result<(Atom, u32), Error> {
    libvirt::create_vm_from_xml(url, xml)
        .map(|value| (atoms::ok(), value))
        .map_err(libvirt_error_to_nif_error)
}

rustler::init!(
    "Elixir.TrackingStation.Libvirt",
    [get_resources, create_vm_from_xml]
);
