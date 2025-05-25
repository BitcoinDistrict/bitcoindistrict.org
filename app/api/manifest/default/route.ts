import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Path to the default icons directory
  const iconsDir = path.join(process.cwd(), 'public', 'icons', 'default');
  
  try {
    // Read the directory to get all icon files
    const iconFiles = fs.readdirSync(iconsDir);
    
    // Filter for icon files and extract sizes
    const icons = iconFiles
      .filter(file => file.startsWith('icon-') && file.endsWith('.png'))
      .map(file => {
        // Extract size from filename (icon-48x48.png -> 48x48)
        const sizeMatch = file.match(/icon-(\d+x\d+)\.png/);
        if (!sizeMatch) return null;
        
        const icon = {
          src: `/icons/default/${file}`,
          sizes: sizeMatch[1],
          type: 'image/png'
        };
        
        // Add purpose for specific sizes that work well as maskable icons
        if (file === 'icon-192x192.png' || file === 'icon-512x512.png') {
          return [
            icon,
            { ...icon, purpose: 'maskable' }
          ];
        }
        
        return icon;
      })
      .flat()
      .filter(Boolean); // Remove any null entries
    
    // Create the manifest object
    const manifest = {
      name: "Bitcoin District",
      short_name: "Bitcoin District",
      description: "Bitcoin District is a network of Bitcoiners living and working in the DC, Maryland & Virginia (DMV) area",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: icons,
      orientation: "portrait",
      scope: "/",
      shortcuts: [
        {
          name: "Home",
          url: "/",
          icons: [
            {
              src: "/icons/default/icon-96x96.png",
              sizes: "96x96",
              type: "image/png"
            }
          ]
        }
      ],
      // iOS specific properties
      apple: {
        startupImage: [
          {
            href: "/icons/default/apple-touch-icon.png",
            media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          }
        ],
        icon: "/icons/default/apple-touch-icon.png"
      }
    };
    
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating manifest:', error);
    
    // Fallback to basic icons if there's an error
    const manifest = {
      name: "Bitcoin District",
      short_name: "Bitcoin District",
      description: "Bitcoin District is a network of Bitcoiners living and working in the DC, Maryland & Virginia (DMV) area",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        {
          src: `/icons/default/icon-192x192.png`,
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: `/icons/default/icon-512x512.png`,
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: `/icons/default/apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png"
        }
      ]
    };
    
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
