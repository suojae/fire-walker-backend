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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var FriendRequestDto = function () {
    var _a;
    var _recipientUuid_decorators;
    var _recipientUuid_initializers = [];
    var _recipientUuid_extraInitializers = [];
    var _senderNickname_decorators;
    var _senderNickname_initializers = [];
    var _senderNickname_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FriendRequestDto() {
                this.recipientUuid = __runInitializers(this, _recipientUuid_initializers, void 0);
                this.senderNickname = (__runInitializers(this, _recipientUuid_extraInitializers), __runInitializers(this, _senderNickname_initializers, void 0));
                __runInitializers(this, _senderNickname_extraInitializers);
            }
            return FriendRequestDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _recipientUuid_decorators = [(0, swagger_1.ApiProperty)({ description: '친구 요청 받는 유저의 UUID' })];
            _senderNickname_decorators = [(0, swagger_1.ApiProperty)({ description: '요청을 보낸 유저의 닉네임' })];
            __esDecorate(null, null, _recipientUuid_decorators, { kind: "field", name: "recipientUuid", static: false, private: false, access: { has: function (obj) { return "recipientUuid" in obj; }, get: function (obj) { return obj.recipientUuid; }, set: function (obj, value) { obj.recipientUuid = value; } }, metadata: _metadata }, _recipientUuid_initializers, _recipientUuid_extraInitializers);
            __esDecorate(null, null, _senderNickname_decorators, { kind: "field", name: "senderNickname", static: false, private: false, access: { has: function (obj) { return "senderNickname" in obj; }, get: function (obj) { return obj.senderNickname; }, set: function (obj, value) { obj.senderNickname = value; } }, metadata: _metadata }, _senderNickname_initializers, _senderNickname_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FriendRequestDto = FriendRequestDto;
