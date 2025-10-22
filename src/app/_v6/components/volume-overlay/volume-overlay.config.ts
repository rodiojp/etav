import { DialogType } from '../../models/shared/dialog-type';
import { DialogConfigFactory } from '../../services/shared/dialog-config-factory';
import { VolumeOverlayComponent } from './volume-overlay.component';

export const VOLUME_OVERLAY_ID = 'volume-overlay';

export const volumeOverlayConfigFactory = () => {
  return DialogConfigFactory.createConfig<VolumeOverlayComponent>(
    VOLUME_OVERLAY_ID,
    DialogType.OVERLAY,
    2,
    VolumeOverlayComponent,
    null,
    {
      width: '500px',
      height: '200px',
      disableClose: true,
    }
  );
};
