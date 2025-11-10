"""
PWA Icon Generator for Anuranan
Creates 192x192 and 512x512 PNG icons
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create an icon with Bengali text and brand colors"""
    # Create image with brand blue background
    img = Image.new('RGB', (size, size), color='#1B4B8F')
    draw = ImageDraw.Draw(img)
    
    # Calculate sizes based on icon size
    if size == 192:
        text_size = 90
        subtitle_size = 22
        text_y = 75
        subtitle_y = 135
    else:  # 512
        text_size = 240
        subtitle_size = 58
        text_y = 200
        subtitle_y = 360
    
    # Try to use a font, fallback to default
    try:
        # Try to load a font (adjust path as needed)
        font = ImageFont.truetype("arial.ttf", text_size)
        subtitle_font = ImageFont.truetype("arial.ttf", subtitle_size)
    except:
        font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # Draw Bengali letter "অ"
    bengali_text = "অ"
    # Get text bounding box
    bbox = draw.textbbox((0, 0), bengali_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (size - text_width) // 2
    draw.text((x, text_y), bengali_text, fill='white', font=font)
    
    # Draw "Anuranan" text
    subtitle = "Anuranan"
    bbox2 = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = bbox2[2] - bbox2[0]
    x2 = (size - subtitle_width) // 2
    draw.text((x2, subtitle_y), subtitle, fill='white', font=subtitle_font)
    
    # Draw a decorative circle
    circle_radius = size // 2 - 20
    circle_bbox = [
        (size // 2 - circle_radius, size // 2 - circle_radius),
        (size // 2 + circle_radius, size // 2 + circle_radius)
    ]
    draw.ellipse(circle_bbox, outline='rgba(255, 255, 255, 0.1)', width=3)
    
    # Save the image
    img.save(output_path, 'PNG', quality=95)
    print(f"Created: {output_path}")

def main():
    # Ensure public directory exists
    os.makedirs('public', exist_ok=True)
    
    # Generate icons
    create_icon(192, 'public/icon-192.png')
    create_icon(512, 'public/icon-512.png')
    
    print("\n✅ Icons generated successfully!")
    print("📁 Files created in public/ folder:")
    print("   - icon-192.png")
    print("   - icon-512.png")
    print("\n🚀 Now commit and deploy these files!")

if __name__ == "__main__":
    main()
