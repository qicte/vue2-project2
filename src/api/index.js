// 将四个模块统一暴露
import * as trademark from '@/api/product/tradeMark';
import * as attr from '@/api/product/attr';
import * as sku from '@/api/product/sku';
import * as spu from '@/api/product/spu';

import permission from '@/api/acl/permission';
import * as user from '@/api/acl/user';
import * as role from '@/api/acl/role';

export default { trademark, attr, sku, spu, user, role, permission };