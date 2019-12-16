import { newSpecPage } from '@stencil/core/testing';
import { AmplifyS3Image } from './amplify-s3-image';

describe('amplify-s3-image spec:', () => {
  describe('Component logic ->', () => {
    let amplifyS3Image;

    beforeEach(() => {
      amplifyS3Image = new AmplifyS3Image();
    });

    it('`imgKey` should be undefined by default', () => {
      expect(amplifyS3Image.imgKey).toBeUndefined();
    });

    it('`path` should be undefined by default', () => {
      expect(amplifyS3Image.path).toBeUndefined();
    });

    it('`body` should be undefined by default', () => {
      expect(amplifyS3Image.body).toBeUndefined();
    });

    it('`contentType` should be set to `binary/octet-stream` by default', () => {
      expect(amplifyS3Image.contentType).toBe('binary/octet-stream');
    });

    it('`level` should be set to `public` by default', () => {
      expect(amplifyS3Image.level).toBe('public');
    });

    it('`track` should be undefined by default', () => {
      expect(amplifyS3Image.track).toBeUndefined();
    });

    it('`identityId` should be undefined by default', () => {
      expect(amplifyS3Image.identityId).toBeUndefined();
    });

    it('`picker` should be set to `false` by default', () => {
      expect(amplifyS3Image.picker).toBe(false);
    });

    it('`height` should be undefined by default', () => {
      expect(amplifyS3Image.height).toBeUndefined();
    });

    it('`width` should be undefined by default', () => {
      expect(amplifyS3Image.width).toBeUndefined();
    });

    it('`overrideStyle` should be `false` by default', () => {
      expect(amplifyS3Image.overrideStyle).toBe(false);
    });

    it('`handleOnLoad` should be undefined by default', () => {
      expect(amplifyS3Image.handleOnLoad).toBeUndefined();
    });

    it('`handleOnError` should be undefined by default', () => {
      expect(amplifyS3Image.handleOnError).toBeUndefined();
    });
  });
  describe('Render logic ->', () => {
    it(`should render no img element without 'imgKey' or 'path'`, async () => {
      const page = await newSpecPage({
        components: [AmplifyS3Image],
        html: `<amplify-s3-image />`,
      });
      expect(page.root).toMatchSnapshot();
    });
  });
});
