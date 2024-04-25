function scaleImage(img, factor) {
    const width = Math.round(img.width * factor);
    const height = Math.round(img.height * factor);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
}

function blitRotateCenter(ctx, image, topLeft, angle) {
    ctx.save();
    ctx.translate(topLeft[0] + image.width / 2, topLeft[1] + image.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

function blitTextCenter(ctx, font, text, x, y) {
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillText(text, x, y);
}
