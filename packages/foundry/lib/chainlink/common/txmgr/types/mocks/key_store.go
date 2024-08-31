// Code generated by mockery v2.43.2. DO NOT EDIT.

package mocks

import (
	context "context"

	mock "github.com/stretchr/testify/mock"

	types "github.com/smartcontractkit/chainlink/v2/common/types"
)

// KeyStore is an autogenerated mock type for the KeyStore type
type KeyStore[ADDR types.Hashable, CHAIN_ID types.ID, SEQ types.Sequence] struct {
	mock.Mock
}

// CheckEnabled provides a mock function with given fields: ctx, address, chainID
func (_m *KeyStore[ADDR, CHAIN_ID, SEQ]) CheckEnabled(ctx context.Context, address ADDR, chainID CHAIN_ID) error {
	ret := _m.Called(ctx, address, chainID)

	if len(ret) == 0 {
		panic("no return value specified for CheckEnabled")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, ADDR, CHAIN_ID) error); ok {
		r0 = rf(ctx, address, chainID)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// EnabledAddressesForChain provides a mock function with given fields: ctx, chainId
func (_m *KeyStore[ADDR, CHAIN_ID, SEQ]) EnabledAddressesForChain(ctx context.Context, chainId CHAIN_ID) ([]ADDR, error) {
	ret := _m.Called(ctx, chainId)

	if len(ret) == 0 {
		panic("no return value specified for EnabledAddressesForChain")
	}

	var r0 []ADDR
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context, CHAIN_ID) ([]ADDR, error)); ok {
		return rf(ctx, chainId)
	}
	if rf, ok := ret.Get(0).(func(context.Context, CHAIN_ID) []ADDR); ok {
		r0 = rf(ctx, chainId)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]ADDR)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context, CHAIN_ID) error); ok {
		r1 = rf(ctx, chainId)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// SubscribeToKeyChanges provides a mock function with given fields: ctx
func (_m *KeyStore[ADDR, CHAIN_ID, SEQ]) SubscribeToKeyChanges(ctx context.Context) (chan struct{}, func()) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for SubscribeToKeyChanges")
	}

	var r0 chan struct{}
	var r1 func()
	if rf, ok := ret.Get(0).(func(context.Context) (chan struct{}, func())); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) chan struct{}); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(chan struct{})
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context) func()); ok {
		r1 = rf(ctx)
	} else {
		if ret.Get(1) != nil {
			r1 = ret.Get(1).(func())
		}
	}

	return r0, r1
}

// NewKeyStore creates a new instance of KeyStore. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewKeyStore[ADDR types.Hashable, CHAIN_ID types.ID, SEQ types.Sequence](t interface {
	mock.TestingT
	Cleanup(func())
}) *KeyStore[ADDR, CHAIN_ID, SEQ] {
	mock := &KeyStore[ADDR, CHAIN_ID, SEQ]{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
