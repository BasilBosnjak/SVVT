import { jest } from "@jest/globals";
import { isAdmin } from "./authMiddleware.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("isAdmin middleware", () => {
  test("calls next() when req.user.isAdmin is true", () => {
    const req = { user: { isAdmin: true } };
    const res = mockRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  // Previously the source called the deprecated res.send(403) shorthand
  // instead of res.status(403).send(...). Express actually special-cases
  // res.send(<number>) to set the real status code too (with a deprecation
  // warning), so the live HTTP behavior was already 403 — but this mock
  // doesn't replicate that legacy shim, so the old code made this assertion
  // fail even though nothing was wrong for real users. Fixed to use the
  // non-deprecated, explicit form, which is both clearer and no longer
  // depends on Express's legacy shorthand.
  test("responds with HTTP 403 when req.user.isAdmin is false", () => {
    const req = { user: { isAdmin: false } };
    const res = mockRes();
    const next = jest.fn();

    expect(() => isAdmin(req, res, next)).toThrow();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("responds with HTTP 403 when req.user is missing entirely", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    expect(() => isAdmin(req, res, next)).toThrow();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
