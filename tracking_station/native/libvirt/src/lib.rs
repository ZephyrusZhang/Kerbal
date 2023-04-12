use rustler::{Atom, Error};
use virt;
use virt::connect::Connect;

mod atoms {
    rustler::atoms! {
        ok,

        // error reasons
        conn_err, // fatal, the connection can't be made or failed to close
    }
}

mod operations;

fn libvirt_err_to_term(libvirt_error: virt::error::Error) -> Error {
    return Error::Term(Box::new(libvirt_error.to_string()));
}

fn ok_tuple<T>(value: T) -> (Atom, T) {
    (atoms::ok(), value)
}

fn build_conn_err() -> Error {
    Error::Term(Box::new(atoms::conn_err()))
}

fn safe_close_connect(mut conn: Connect) -> Result<(), Error> {
    match conn.close() {
        Ok(reference_count) => {
            println!("after close: {} refs live", reference_count);
            Ok(())
        }
        Err(_) => Err(Error::Term(Box::new(atoms::conn_err()))),
    }
}

#[rustler::nif(schedule = "DirtyIo")]
fn get_resources(url: &str) -> Result<(Atom, operations::ResourceSpec), Error> {
    let conn = Connect::open(url).map_err(|_| build_conn_err())?;
    let result = operations::get_resources(&conn);
    safe_close_connect(conn)?;
    result.map(ok_tuple).map_err(libvirt_err_to_term)
}

#[rustler::nif(schedule = "DirtyIo")]
fn create_vm_from_xml(url: &str, xml: &str) -> Result<(Atom, u32), Error> {
    let conn = Connect::open(url).map_err(|_| build_conn_err())?;
    let result = operations::create_vm_from_xml(&conn, xml);
    safe_close_connect(conn)?;
    result.map(ok_tuple).map_err(libvirt_err_to_term)
}

#[rustler::nif(schedule = "DirtyIo")]
fn poll_domain_stats(url: &str, domain_id: u32) -> Result<(Atom, operations::DomainStats), Error> {
    let conn = Connect::open(url).map_err(|_| build_conn_err())?;
    let result = operations::poll_domain_stats(&conn, domain_id);
    safe_close_connect(conn)?;
    result.map(ok_tuple).map_err(libvirt_err_to_term)
}

// #[rustler::nif(schedule = "DirtyIo")]
// fn qemu_guest_agent(url: &str, domain_id: u32, data: Binary) -> Result<(Atom, Vec<u8>), Error> {
//     let conn = Connect::open(url).map_err(|_| build_conn_err())?;
//     let stream = match Stream::new(&conn, 0).map_err(libvirt_err_to_term) {
//         Ok(stream) => stream,
//         Err(e) => {
//             safe_close_connect(conn)?;
//             return Err(e);
//         }
//     };
//     let result = operations::qemu_guest_agent(&conn, domain_id, &stream, data.as_slice());
//     stream
//         .free()
//         .map_err(libvirt_err_to_term)
//         .and(safe_close_connect(conn))?;
//     result.map(ok_tuple).map_err(libvirt_err_to_term)
// }

rustler::init!(
    "Elixir.TrackingStation.Libvirt",
    [get_resources, create_vm_from_xml, poll_domain_stats]
);
