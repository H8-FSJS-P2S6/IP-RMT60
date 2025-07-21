
const Mux = require('@mux/mux-node');

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

const mux = new Mux(MUX_TOKEN_ID, MUX_TOKEN_SECRET);

class VideoController {
  static async upload(req, res, next) {
    try {
      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          playback_policy: 'public',
          encoding_tier: 'baseline'
        },
        cors_origin: '*'
      });

      res.status(201).json({
        id: upload.id,
        url: upload.url
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VideoController;
