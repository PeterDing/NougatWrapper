// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri_plugin_positioner::{Position, WindowExt};

mod screencapture;

use screencapture::{cut_image, screencapture};

// #[tauri::command]
// fn screencapture(image_path: &str, app_handle: tauri::AppHandle) {
//     // if let Some(win) = app_handle.get_focused_window() {
//     //     win.hide().unwrap();
//     // }
//     Command::new("screencapture")
//         .arg("-i")
//         .arg(image_path)
//         .output()
//         .unwrap();
// }

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
    let system_tray_menu = SystemTrayMenu::new().add_item(quit);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![screencapture, cut_image])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick { .. } => {
                    let window = app.get_window("main").unwrap();
                    // use TrayCenter as initial window position
                    let _ = window.move_window(Position::TrayCenter);
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Focused(is_focused) => {
                // detect click outside of the focused window and hide the app
                if !is_focused {
                    event.window().hide().unwrap();
                }
            }
            _ => {}
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // this is a workaround for the window to always show in current workspace.
            // see https://github.com/tauri-apps/tauri/issues/2801
            window.set_always_on_top(true)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
