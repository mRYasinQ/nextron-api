import { SetMetadata } from '@nestjs/common';

const REQUIRE_ADMIN_KEY = 'REQUIRE_ADMIN';

const RequireAdmin = () => SetMetadata(REQUIRE_ADMIN_KEY, true);

export { REQUIRE_ADMIN_KEY };
export default RequireAdmin;
