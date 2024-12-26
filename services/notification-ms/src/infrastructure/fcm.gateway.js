"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmGateway = void 0;
var common_1 = require("@nestjs/common");
var admin = require("firebase-admin");
var axios_1 = require("axios");
var serviceAccount = require("../../serviceAccountKey.json");
var FcmGateway = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FcmGateway = _classThis = /** @class */ (function () {
        function FcmGateway_1(httpService) {
            this.httpService = httpService;
            this.logger = new common_1.Logger(FcmGateway.name);
            // Firebase Admin SDK 초기화
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            }
        }
        /**
         * FCM 알림 전송 메서드
         * @param recipientUuids 수신 대상 유저들의 UUID 목록
         * @param payload 알림에 담길 메시지 정보(title, body, data 등)
         */
        FcmGateway_1.prototype.sendNotification = function (recipientUuids, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var tokens, message, response, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.getFcmTokensByUserUuids(recipientUuids)];
                        case 1:
                            tokens = _c.sent();
                            if (!tokens || tokens.length === 0) {
                                this.logger.warn('No FCM tokens found for the given recipients');
                                return [2 /*return*/];
                            }
                            message = {
                                notification: {
                                    title: (_a = payload.title) !== null && _a !== void 0 ? _a : '알림',
                                    body: (_b = payload.body) !== null && _b !== void 0 ? _b : '',
                                },
                                data: payload.data ? this.serializeData(payload.data) : {},
                                tokens: tokens,
                            };
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, admin.messaging().sendEachForMulticast(message)];
                        case 3:
                            response = _c.sent();
                            this.logger.log("FCM Response: ".concat(JSON.stringify(response)));
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _c.sent();
                            if (error_1 instanceof axios_1.AxiosError) {
                                this.logger.error("Axios error while sending FCM: ".concat(error_1.message));
                            }
                            else {
                                this.logger.error("FCM send error: ".concat(error_1));
                            }
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * User MS를 호출하여 해당 유저들의 FCM 토큰 목록을 가져오는 메서드
         * @param userUuids 유저 UUID 배열
         * @returns FCM Token 문자열 배열
         */
        FcmGateway_1.prototype.getFcmTokensByUserUuids = function (userUuids) {
            return __awaiter(this, void 0, void 0, function () {
                var url, response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            url = 'http://user-ms:3000/api/users/fcm-tokens';
                            return [4 /*yield*/, this.httpService.axiosRef.get(url, {
                                    params: {
                                        userUuids: userUuids.join(','),
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            // 예: User MS에서 { tokens: ['token1', 'token2', ...] } 형태로 응답한다고 가정
                            return [2 /*return*/, response.data.tokens || []];
                        case 2:
                            error_2 = _a.sent();
                            if (error_2 instanceof axios_1.AxiosError) {
                                this.logger.error("AxiosError when calling User MS: ".concat(error_2.message));
                            }
                            else {
                                this.logger.error("Error when calling User MS: ".concat(error_2));
                            }
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * FCM Data Payload는 문자열만 허용됨. 따라서 object -> string 변환이 필요할 수 있음
         */
        FcmGateway_1.prototype.serializeData = function (data) {
            var serialized = {};
            for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                var key = _a[_i];
                serialized[key] = typeof data[key] === 'object'
                    ? JSON.stringify(data[key])
                    : String(data[key]);
            }
            return serialized;
        };
        return FcmGateway_1;
    }());
    __setFunctionName(_classThis, "FcmGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FcmGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FcmGateway = _classThis;
}();
exports.FcmGateway = FcmGateway;
