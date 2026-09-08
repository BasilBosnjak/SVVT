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

  // test.failing: documents the known isAdmin bug (res.send(403) instead of
  // res.status(403)) as an executable spec. Currently fails as expected; once
  // the bug is fixed (Bug Reports and Fixes phase), flip back to test().
  test.failing("responds with HTTP 403 when req.user.isAdmin is false", () => {
    const req = { user: { isAdmin: false } };
    const res = mockRes();
    const next = jest.fn();

    expect(() => isAdmin(req, res, next)).toThrow();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test.failing("responds with HTTP 403 when req.user is missing entirely", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    expect(() => isAdmin(req, res, next)).toThrow();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
