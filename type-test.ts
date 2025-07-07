import * as ogg from './index';

// Test ogg_packet creation and usage
const packet = new ogg.ogg_packet();
packet.packet = Buffer.from('test data');
console.log('Packet bytes:', packet.bytes);
console.log('Packet e_o_s:', packet.e_o_s);
console.log('Packet b_o_s:', packet.b_o_s);
console.log('Packet granulepos:', packet.granulepos);
console.log('Packet packetno:', packet.packetno);

// Test Decoder usage
const decoder = new ogg.Decoder();
decoder.on('stream', (stream) => {
  console.log('Stream serialno:', stream.serialno);
  
  stream.on('packet', (packet) => {
    console.log('Received packet with', packet.bytes, 'bytes');
  });
  
  stream.on('bos', () => {
    console.log('Beginning of stream');
  });
  
  stream.on('eos', () => {
    console.log('End of stream');
  });
});

// Test Encoder usage
const encoder = new ogg.Encoder();
const encoderStream = encoder.stream(12345);

encoderStream.on('page', (page) => {
  console.log('Encoded page with', page.length, 'bytes');
});

// Test writing packets
encoderStream.packetin(packet, (error) => {
  if (error) {
    console.error('Error writing packet:', error);
  } else {
    console.log('Packet written successfully');
  }
});

// Test pageout and flush
encoderStream.pageout((error) => {
  if (error) {
    console.error('Error during pageout:', error);
  }
});

encoderStream.flush((error) => {
  if (error) {
    console.error('Error during flush:', error);
  }
});

// Test use method with a readable stream
const encoder2 = new ogg.Encoder();
const { Readable } = require('stream');
const mockReadable = new Readable({
  objectMode: true,
  read() {
    this.push(packet);
    this.push(null); // End the stream
  }
});
encoder2.use(mockReadable);

console.log('All type checks passed!');
