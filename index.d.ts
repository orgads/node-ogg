/// <reference types="node" />

import { Writable, Readable } from 'stream';

declare namespace ogg {
  /**
   * Encapsulates an `ogg_packet` C struct instance. The `ogg_packet`
   * class is a Node.js Buffer subclass.
   */
  export class ogg_packet extends Buffer {
    /**
     * Creates a new ogg_packet instance.
     * @param buffer Optional buffer to use as backing store. If not provided, a new buffer will be created.
     */
    constructor(buffer?: Buffer);

    /**
     * The packet data buffer.
     */
    packet: Buffer;

    /**
     * The number of bytes in the packet.
     */
    readonly bytes: number;

    /**
     * End of stream flag (1 if this is the last packet in the stream, 0 otherwise).
     */
    readonly e_o_s: number;

    /**
     * Beginning of stream flag (1 if this is the first packet in the stream, 0 otherwise).
     */
    readonly b_o_s: number;

    /**
     * Granule position for this packet.
     */
    readonly granulepos: number;

    /**
     * Packet sequence number.
     */
    readonly packetno: number;

    /**
     * Creates a new Buffer instance to back this `ogg_packet` instance.
     * Typically this function is used to take control over the bytes backing the
     * `ogg_packet` instance when the library that filled the packet reuses the
     * backing memory store for each `ogg_packet` instance.
     */
    replace(): void;
  }

  /**
   * Alias for ogg_packet.
   */
  export const packet: typeof ogg_packet;

  /**
   * The `DecoderStream` class represents a single logical bitstream within an OGG container.
   * It emits "packet" events for each `ogg_packet` in the stream.
   */
  export class DecoderStream extends Readable {
    /**
     * The serial number of this stream.
     */
    readonly serialno: number;

    /**
     * Listen for packet events (mapped to 'data' events internally).
     */
    on(event: 'packet', listener: (packet: ogg_packet) => void): this;
    on(event: 'data', listener: (packet: ogg_packet) => void): this;
    on(event: 'page', listener: (page: Buffer) => void): this;
    on(event: 'bos', listener: () => void): this;
    on(event: 'eos', listener: () => void): this;
    on(event: string, listener: Function): this;

    once(event: 'packet', listener: (packet: ogg_packet) => void): this;
    once(event: 'data', listener: (packet: ogg_packet) => void): this;
    once(event: 'page', listener: (page: Buffer) => void): this;
    once(event: 'bos', listener: () => void): this;
    once(event: 'eos', listener: () => void): this;
    once(event: string, listener: Function): this;

    addListener(event: 'packet', listener: (packet: ogg_packet) => void): this;
    addListener(event: 'data', listener: (packet: ogg_packet) => void): this;
    addListener(event: 'page', listener: (page: Buffer) => void): this;
    addListener(event: 'bos', listener: () => void): this;
    addListener(event: 'eos', listener: () => void): this;
    addListener(event: string, listener: Function): this;

    removeListener(event: 'packet', listener: (packet: ogg_packet) => void): this;
    removeListener(event: 'data', listener: (packet: ogg_packet) => void): this;
    removeListener(event: 'page', listener: (page: Buffer) => void): this;
    removeListener(event: 'bos', listener: () => void): this;
    removeListener(event: 'eos', listener: () => void): this;
    removeListener(event: string, listener: Function): this;
  }

  /**
   * The ogg `Decoder` class. Write an OGG file stream to it, and it'll emit
   * "stream" events for each embedded stream. The DecoderStream instances emit
   * "packet" events with the raw `ogg_packet` instance to send to an ogg stream
   * decoder (like Vorbis, Theora, etc.).
   */
  export class Decoder extends Writable {
    /**
     * Creates a new Decoder instance.
     * @param opts Writable stream options
     */
    constructor(opts?: any);

    /**
     * Listen for stream events.
     */
    on(event: 'stream', listener: (stream: DecoderStream) => void): this;
    on(event: 'page', listener: (page: Buffer) => void): this;
    on(event: string, listener: Function): this;

    once(event: 'stream', listener: (stream: DecoderStream) => void): this;
    once(event: 'page', listener: (page: Buffer) => void): this;
    once(event: string, listener: Function): this;

    addListener(event: 'stream', listener: (stream: DecoderStream) => void): this;
    addListener(event: 'page', listener: (page: Buffer) => void): this;
    addListener(event: string, listener: Function): this;

    removeListener(event: 'stream', listener: (stream: DecoderStream) => void): this;
    removeListener(event: 'page', listener: (page: Buffer) => void): this;
    removeListener(event: string, listener: Function): this;
  }

  /**
   * The `EncoderStream` class abstracts the `ogg_stream` data structure when
   * used with the encoding interface. You should not need to create instances of
   * `EncoderStream` manually, instead, instances are returned from the
   * `Encoder#stream()` function.
   */
  export class EncoderStream extends Writable {
    /**
     * The serial number of this stream.
     */
    readonly serialno: number;

    /**
     * Write an ogg_packet to this stream.
     * @param packet The ogg_packet to write
     * @param callback Optional callback function
     */
    write(packet: ogg_packet | Buffer, callback?: (error?: Error) => void): boolean;

    /**
     * Alias for write() - submits an ogg_packet to this stream.
     * @param packet The ogg_packet to write
     * @param callback Optional callback function
     */
    packetin(packet: ogg_packet | Buffer, callback?: (error?: Error) => void): boolean;

    /**
     * Request that `ogg_stream_pageout()` be called on this stream.
     * @param callback Optional callback function
     */
    pageout(callback?: (error?: Error) => void): boolean;

    /**
     * Request that `ogg_stream_flush()` be called on this stream.
     * @param callback Optional callback function
     */
    flush(callback?: (error?: Error) => void): boolean;

    /**
     * Listen for page events.
     */
    on(event: 'page', listener: (page: Buffer) => void): this;
    on(event: string, listener: Function): this;

    once(event: 'page', listener: (page: Buffer) => void): this;
    once(event: string, listener: Function): this;

    addListener(event: 'page', listener: (page: Buffer) => void): this;
    addListener(event: string, listener: Function): this;

    removeListener(event: 'page', listener: (page: Buffer) => void): this;
    removeListener(event: string, listener: Function): this;
  }

  /**
   * The `Encoder` class.
   * Welds one or more `EncoderStream` instances into a single bitstream.
   */
  export class Encoder extends Readable {
    /**
     * Creates a new Encoder instance.
     * @param opts Readable stream options
     */
    constructor(opts?: any);

    /**
     * Creates a new EncoderStream instance and returns it for the user to begin
     * submitting `ogg_packet` instances to it.
     * @param serialno The serial number of the stream, null/undefined means random.
     * @returns The newly created EncoderStream instance. Call `.packetin()` on it.
     */
    stream(serialno?: number): EncoderStream;

    /**
     * Convenience function to attach an Ogg stream encoder to this Ogg encoder instance.
     * @param stream An Ogg stream encoder that outputs `ogg_packet` Buffer instances.
     * @returns Returns `this` for chaining.
     */
    use(stream: Readable): this;

    /**
     * Map of `EncoderStream` instances keyed by their serial number.
     */
    readonly streams: { [serialno: number]: EncoderStream };
  }
}

declare const ogg: {
  ogg_packet: typeof ogg.ogg_packet;
  packet: typeof ogg.ogg_packet;
  Decoder: typeof ogg.Decoder;
  Encoder: typeof ogg.Encoder;
};

export = ogg;
