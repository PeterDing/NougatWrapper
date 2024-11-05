use xcap::Monitor;

#[tauri::command]
fn screencapture(x: i32, y: i32, image_path: &str) {
    let monitors = Monitor::all().unwrap();
    for monitor in monitors {
        if monitor.x() == x && monitor.y() == y {
            let image = monitor.capture_image().unwrap();
            image.save(image_path).unwrap();
            break;
        }
    }
}

#[tauri::command]
fn cut_image(x: u32, y: u32, width: u32, height: u32, input_path: &str, output_path: &str) {
    let image = image::open(input_path).unwrap();
    let image = image.crop_imm(x, y, width, height);
    image.save(output_path).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![screencapture, cut_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
