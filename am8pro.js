export function Name() { return "Fifine AM8 Pro"; }
export function VendorId() { return [0x3142]; }
export function ProductId() { return [0x01A8]; }
export function Publisher() { return "Iren"; }
export function Size() { return [12, 1]; }
export function Type() { return "Hid"; }
export function DefaultPosition(){ return [0, 0]; }
export function LedCount() { return 12; }
export function SuggestedLayout() {
    return {
        "width": 12,
        "height": 1,
        "coords": Array.from({length: 12}, (_, i) => [i, 0])
    }
}

export function Initialize() {
    
}

export function Render() {
    const ledCount = 12;
    
    // Header: 0xA5, 0x5A, 0xFE, 0x26, 0x0B, 0x0C
    // We prepend 0x00 as the Report ID.
    let packet = [0x00, 0xa5, 0x5a, 0xfe, 0x26, 0x0b, 0x0c];

    // Iterating backwards to match physical LED layout (11 -> 0)
    for (let i = ledCount - 1; i >= 0; i--) {
        let col = device.color(i, 0);
        
        // FIXED: Swapped back to RGB order
        packet.push(col[0]); // Red
        packet.push(col[1]); // Green
        packet.push(col[2]); // Blue
    }

    // Footer
    packet.push(0x16);

    // Padding to 257 bytes (Report ID + 256 bytes data)
    while(packet.length < 257) {
        packet.push(0x00);
    }

    device.write(packet, 256);
}

export function Shutdown() {
    const ledCount = 12;
    let packet = [0x00, 0xa5, 0x5a, 0xfe, 0x26, 0x0b, 0x0c];

    for (let i = 0; i < ledCount * 3; i++) {
        packet.push(0x00);
    }

    packet.push(0x16);

    while(packet.length < 257) {
        packet.push(0x00);
    }

    device.write(packet, 256);
}

export function Validate(endpoint) {
    // Keep forcing Interface 4 (Usage Page 0xFF00)
    return endpoint.interface === 4;
}

export function Image() {
  return ""
}