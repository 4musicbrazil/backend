import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../enum/role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const buildContext = (role?: string) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role: { name: role } } : undefined,
        }),
      }),
    }) as unknown as ExecutionContext;

  const buildGuard = (requiredRoles?: Role[]) => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    } as unknown as Reflector;

    return new RolesGuard(reflector);
  };

  it('allows routes without role restrictions', () => {
    expect(buildGuard().canActivate(buildContext())).toBe(true);
  });

  it('allows a user with a required role', () => {
    expect(
      buildGuard([Role.ADMIN]).canActivate(buildContext(Role.ADMIN)),
    ).toBe(true);
  });

  it('allows owners as superusers', () => {
    expect(
      buildGuard([Role.ADMIN]).canActivate(buildContext(Role.OWNER)),
    ).toBe(true);
  });

  it('denies users without a required role', () => {
    expect(buildGuard([Role.ADMIN]).canActivate(buildContext(Role.USER))).toBe(
      false,
    );
  });
});
