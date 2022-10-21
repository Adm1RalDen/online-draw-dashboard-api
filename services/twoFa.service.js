const speakeasy = require("speakeasy");

class TwoFA {
  static generateSecret() {
    return speakeasy.generateSecret({
      name: "Draw Online",
      length: 10
    });
  }

  static verify2Fa(secret, code) {
    return speakeasy.totp.verify({
      secret,
      token: code,
      encoding: "base32",
    });
  }
}

module.exports = TwoFA;
