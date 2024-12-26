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
exports.FriendAcceptDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var FriendAcceptDto = function () {
    var _a;
    var _requesterUuid_decorators;
    var _requesterUuid_initializers = [];
    var _requesterUuid_extraInitializers = [];
    var _recipientNickname_decorators;
    var _recipientNickname_initializers = [];
    var _recipientNickname_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FriendAcceptDto() {
                this.requesterUuid = __runInitializers(this, _requesterUuid_initializers, void 0);
                this.recipientNickname = (__runInitializers(this, _requesterUuid_extraInitializers), __runInitializers(this, _recipientNickname_initializers, void 0));
                __runInitializers(this, _recipientNickname_extraInitializers);
            }
            return FriendAcceptDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _requesterUuid_decorators = [(0, swagger_1.ApiProperty)({ description: '친구 요청을 보낸 유저의 UUID' })];
            _recipientNickname_decorators = [(0, swagger_1.ApiProperty)({ description: '친구 요청을 수락한 유저의 닉네임' })];
            __esDecorate(null, null, _requesterUuid_decorators, { kind: "field", name: "requesterUuid", static: false, private: false, access: { has: function (obj) { return "requesterUuid" in obj; }, get: function (obj) { return obj.requesterUuid; }, set: function (obj, value) { obj.requesterUuid = value; } }, metadata: _metadata }, _requesterUuid_initializers, _requesterUuid_extraInitializers);
            __esDecorate(null, null, _recipientNickname_decorators, { kind: "field", name: "recipientNickname", static: false, private: false, access: { has: function (obj) { return "recipientNickname" in obj; }, get: function (obj) { return obj.recipientNickname; }, set: function (obj, value) { obj.recipientNickname = value; } }, metadata: _metadata }, _recipientNickname_initializers, _recipientNickname_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FriendAcceptDto = FriendAcceptDto;
