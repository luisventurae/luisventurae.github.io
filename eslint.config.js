import { eslint_config } from '@portfolio/config/eslint'

// TODO(chunk-5): remove the legacy worker ignore once it is migrated to apps/api.
export default [...eslint_config, { ignores: ['worker/**'] }]
