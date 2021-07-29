#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use config::{Config, File};
use napi::{CallContext, JsBoolean, JsNumber, JsObject, JsString, JsUndefined, Result};
use sled::open;
use std::convert::TryInto;

#[cfg(all(
    unix,
    not(target_env = "musl"),
    not(target_arch = "aarch64"),
    not(target_arch = "arm"),
    not(debug_assertions)
))]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[cfg(all(windows, target_arch = "x86_64"))]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;

fn get_name() -> String {
    let mut config = Config::default();

    config.merge(File::with_name("sled")).unwrap();

    config.get("name").expect("No configuration file.")
}

#[js_function(2)]
fn set(ctx: CallContext) -> Result<JsString> {
    let tree = open(get_name()).expect("Failed opening database.");
    let key = ctx.get::<JsString>(0)?.into_utf8()?;
    let value = ctx.get::<JsString>(1)?.into_utf8()?;

    tree.insert(key.as_str()?, value.as_str()?)
        .expect("Failed to set key.");
    tree.flush().expect("Failed to flush.");

    ctx.env.create_string(value.as_str()?)
}

#[js_function(1)]
fn get(ctx: CallContext) -> Result<JsString> {
    let tree = open(get_name()).expect("Failed opening database.");
    let key = ctx.get::<JsString>(0)?.into_utf8()?;
    let value = tree.get(key.as_str()?).expect("Failed to get key.");

    tree.flush().expect("Failed to flush.");

    if value == None {
        ctx.env.create_string("")
    } else {
        ctx.env.create_string(
            String::from_utf8(value.unwrap().to_vec())
                .expect("Failed to convert.")
                .as_str(),
        )
    }
}

#[js_function(0)]
fn first(ctx: CallContext) -> Result<JsString> {
    let tree = open(get_name()).expect("Failed opening database.");
    let value = tree.first().expect("Failed to get first key.");

    tree.flush().expect("Failed to flush.");

    if value == None {
        ctx.env.create_string("")
    } else {
        ctx.env.create_string(
            String::from_utf8(value.unwrap().1.to_vec())
                .expect("Failed to convert.")
                .as_str(),
        )
    }
}

#[js_function(0)]
fn array(ctx: CallContext) -> Result<JsObject> {
    let tree = open(get_name()).expect("Failed opening database.");
    let mut arr = ctx.env.create_array()?;
    let vals = tree.iter();

    tree.flush().expect("Failed to flush.");

    for (i, item) in vals.enumerate() {
        arr.set_element(
            i.try_into().unwrap(),
            ctx.env.create_string(
                String::from_utf8(item.expect("").1.to_vec())
                    .expect("Failed to convert.")
                    .as_str(),
            )?,
        )?;
    }

    Ok(arr)
}

#[js_function(0)]
fn clear(ctx: CallContext) -> Result<JsUndefined> {
    let tree = open(get_name()).expect("Failed opening database.");

    tree.clear().expect("Failed clearing.");
    tree.flush().expect("Failed to flush.");

    ctx.env.get_undefined()
}

#[js_function(0)]
fn last(ctx: CallContext) -> Result<JsString> {
    let tree = open(get_name()).expect("Failed opening database.");
    let value = tree.last().expect("Failed to get last key.");

    tree.flush().expect("Failed to flush.");

    if value == None {
        ctx.env.create_string("")
    } else {
        ctx.env.create_string(
            String::from_utf8(value.unwrap().1.to_vec())
                .expect("Failed to convert.")
                .as_str(),
        )
    }
}

#[js_function(1)]
fn remove(ctx: CallContext) -> Result<JsUndefined> {
    let tree = open(get_name()).expect("Failed opening database.");
    let key = ctx.get::<JsString>(0)?.into_utf8()?;

    tree.remove(key.as_str()?).expect("Failed to remove key.");
    tree.flush().expect("Failed to flush.");

    ctx.env.get_undefined()
}

#[js_function(0)]
fn size(ctx: CallContext) -> Result<JsNumber> {
    let tree = open(get_name()).expect("Failed opening database.");
    let len = tree.len();

    tree.flush().expect("Failed to flush.");

    ctx.env
        .create_int64(len.try_into().expect("Failed to convert."))
}

#[js_function(1)]
fn has(ctx: CallContext) -> Result<JsBoolean> {
    let tree = open(get_name()).expect("Failed opening database.");
    let key = ctx.get::<JsString>(0)?.into_utf8()?;
    let contains = tree
        .contains_key(key.as_str()?)
        .expect("Failed to see if the database has the provided key.");

    tree.flush().expect("Failed to flush.");

    ctx.env.get_boolean(contains)
}

#[js_function(0)]
fn key_array(ctx: CallContext) -> Result<JsObject> {
    let tree = open(get_name()).expect("Failed opening database.");
    let mut arr = ctx.env.create_array()?;
    let vals = tree.iter();

    tree.flush().expect("Failed to flush.");

    for (i, item) in vals.enumerate() {
        arr.set_element(
            i.try_into().unwrap(),
            ctx.env.create_string(
                String::from_utf8(item.expect("").0.to_vec())
                    .expect("Failed to convert.")
                    .as_str(),
            )?,
        )?;
    }

    Ok(arr)
}

#[js_function(0)]
fn all(ctx: CallContext) -> Result<JsObject> {
    let tree = open(get_name()).expect("Failed opening database.");
    let mut arr = ctx.env.create_array()?;
    let vals = tree.iter();

    tree.flush().expect("Failed to flush.");

    for (i, item) in vals.enumerate() {
        let mut obj = ctx.env.create_object()?;
		let new_item = item.clone();

        obj.set_named_property(
            String::from_utf8(item.expect("").0.to_vec())
                .expect("Failed to convert.")
                .as_str(),
            ctx.env.create_string(
                String::from_utf8(new_item.expect("").1.to_vec())
                    .expect("Failed to convert.")
                    .as_str(),
            )?,
        )?;

        arr.set_element(i.try_into().unwrap(), obj)?;
    }

    Ok(arr)
}

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
    exports.create_named_method("set", set)?;
    exports.create_named_method("get", get)?;
    exports.create_named_method("first", first)?;
    exports.create_named_method("array", array)?;
    exports.create_named_method("clear", clear)?;
    exports.create_named_method("last", last)?;
    exports.create_named_method("remove", remove)?;
    exports.create_named_method("size", size)?;
    exports.create_named_method("has", has)?;
    exports.create_named_method("keyArray", key_array)?;
	exports.create_named_method("all", all)?;

    Ok(())
}
