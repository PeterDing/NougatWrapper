use screenshots::Screen;

#[tauri::command]
pub fn screencapture(x: i32, y: i32, image_path: &str) {
    let screens = Screen::all().unwrap();
    for screen in screens {
        let info = screen.display_info;
        if info.x == x && info.y == y {
            let image = screen.capture().unwrap();
            image.save(image_path).unwrap();
            break;
        }
    }
}

#[tauri::command]
pub fn cut_image(x: u32, y: u32, width: u32, height: u32, input_path: &str, output_path: &str) {
    let image = image::open(input_path).unwrap();
    let image = image.crop_imm(x, y, width, height);
    image.save(output_path).unwrap();
}
