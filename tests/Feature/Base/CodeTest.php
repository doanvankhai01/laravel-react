<?php

namespace Tests\Feature\Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Code;
use App\Models\Base\CodeType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class CodeTest extends TestCase
{
  use WithFaker, RefreshDatabase;
  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }
  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_CODE_TYPE_INDEX->value,
      EPermissions::P_CODE_TYPE_STORE->value,
      EPermissions::P_CODE_TYPE_SHOW->value,
      EPermissions::P_CODE_TYPE_UPDATE->value,
      EPermissions::P_CODE_TYPE_DESTROY->value,

      EPermissions::P_CODE_INDEX->value,
      EPermissions::P_CODE_STORE->value,
      EPermissions::P_CODE_SHOW->value,
      EPermissions::P_CODE_UPDATE->value,
      EPermissions::P_CODE_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = CodeType::factory()->raw();
    $res = $this->post('/api/codes/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('code_types', $type);
      $type['id'] = $res['id'];
    }

    $res = $this->get('/api/codes/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['id'] == $type['id']) {
          foreach($type as $key=>$value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('code_types', [...$type, 'disabled_at' => null]);
      $this->put('/api/codes/types/' . $res['data'][1]['code'], ['is_disable' => true])->assertStatus(200);
      $this->assertDatabaseMissing('code_types', [...$type, 'disabled_at' => null]);
    }

    $type = CodeType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/codes/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('code_types', $type);

    $data = Code::factory()->raw(['type_code' => $type['code']]);
    $res = $this->post('/api/codes/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('codes', $data);
      $data['id'] = $res['id'];
    }

    $res = $this->get('/api/codes/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(2, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['code'] == $data['code']) {
          foreach($data as $key=>$value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    $res = $this->get('/api/codes/'. $data['code']. '?include=type')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach($type as $key=>$value) {
        $this->assertEquals($value, $res['data']['type'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertDatabaseHas('codes', [...$data, 'disabled_at' => null]);
    $this->put('/api/codes/' . $data['code']. '?include=type', ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('codes', [...$data, 'disabled_at' => null]);

    $data = Code::factory()->raw(['code' => $data['code'], 'type_code' => $type['code']]);
    $this->put('/api/codes/' . $data['code'], $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('codes', $data);

    $res = $this->get('/api/codes/types/'. $type['code'] . '?include=codes')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach($data as $key=>$value) {
        $this->assertEquals($value, $res['data']['codes'][0][Str::camel($key)]);
      }
    }

    $this->delete('/api/codes/' . $data['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    $data['deleted_at'] = null;
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('codes', $data);

    $this->delete('/api/codes/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    $type['deleted_at'] = null;
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('code_types', $type);
  }
}
