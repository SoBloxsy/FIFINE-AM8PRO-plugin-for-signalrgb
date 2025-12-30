export function Name() { return "Fifine BM38 Boom Arm"; }
export function VendorId() { return [0x3142]; }
export function ProductId() { return [0x0038]; }
export function Publisher() { return "Iren"; }
export function Size() { return [48, 1]; }
export function Type() { return "Hid"; }
export function DefaultPosition(){ return [0, 0]; }
export function LedCount() { return 48; }
export function SuggestedLayout() {
    return {
        "width": 48,
        "height": 1,
        "coords": Array.from({length: 48}, (_, i) => [i, 0])
    }
}

export function Initialize() {
    
}

export function Render() {
    const ledCount = 48;
    // Header: Command 0x41 (65), LED Count 0x30 (48)
    let packet = [0x41, 0x30];

    // FIXED: Loop direction flipped (0 -> 47)
    for (let i = 0; i < ledCount; i++) {
        let color = device.color(i, 0); 
        
        packet.push(color[0]); // Red
        packet.push(color[1]); // Green
        packet.push(color[2]); // Blue
    }

    // Footer
    packet.push(0x01);

    // Chunking Logic
    let buffer = packet;
    
    while (buffer.length > 0) {
        let chunk = buffer.splice(0, 64);

        while (chunk.length < 64) {
            chunk.push(0x00);
        }

        chunk.unshift(0x00);
        device.write(chunk, 65);
    }
}

export function Shutdown() {
    const ledCount = 48;
    let packet = [0x41, 0x30];
    
    for(let i = 0; i < ledCount * 3; i++) {
        packet.push(0);
    }
    
    packet.push(0x01);

    let buffer = packet;
    while (buffer.length > 0) {
        let chunk = buffer.splice(0, 64);
        while (chunk.length < 64) { chunk.push(0x00); }
        chunk.unshift(0x00);
        device.write(chunk, 65);
    }
}

export function Validate(endpoint) {
    return true;
}

export function Image() {
  return ""
}